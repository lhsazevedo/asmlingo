import { AtLeastOne } from "@/types";
import type { z as Zod, ZodError, ZodObject } from "zod";
import { UserRepositoryContract } from "../contracts/UserRepositoryContract";
import { HashContract } from "../contracts/HashContract";

export type CreateUserDto = {
  name: string;
  email: string;
  password: string;
};

export type UpdateUserDto = AtLeastOne<CreateUserDto>;

export type CreateUserErrors = {
  [K in keyof CreateUserDto]?: string;
};

export type UpdateUserErrors = {
  [K in keyof UpdateUserDto]?: string;
};

// TODO: Maybe create a generic validation error class?
export class CreateUserValidationError extends Error {
  constructor(public messages: CreateUserErrors) {
    super("Validation failed");
  }
}

// Generic type for validation errors
type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export class UserService {
  private readonly z: typeof Zod;

  private readonly schema: ZodObject<{
    name: Zod.ZodString;
    email: Zod.ZodString;
    password: Zod.ZodString;
  }>;

  constructor(
    private readonly hash: HashContract,
    private readonly userRepository: UserRepositoryContract,
    validator: typeof Zod,
  ) {
    this.z = validator;

    this.schema = validator.object({
      name: this.z.string().min(2).max(50),
      email: this.z.string().email("Invalid email address"),
      password: this.z
        .string()
        .min(8, "Password must be at least 8 characters long"),
    });
  }

  private validateCreate(data: CreateUserDto) {
    const result = this.schema.safeParse(data);

    if (!result.success) {
      const errors = this.processZodErrors(result.error);
      throw new CreateUserValidationError(errors);
    }
  }

  private validateUpdate(data: UpdateUserDto) {
    // We are using the same schema for both create and update because they
    // where sufficiently similar at the time of writing this code.
    const result = this.schema.partial().safeParse(data);

    if (!result.success) {
      const errors = this.processZodErrors(result.error);
      throw new CreateUserValidationError(errors);
    }
  }

  /**
   * Extracts only the first error message for each field from a ZodError.
   *
   * @todo This method should be moved to a utility class or module.
   */
  private processZodErrors<T>(result: ZodError<T>): ValidationErrors<T> {
    const errors: ValidationErrors<T> = {};
    const zodErrors = result.flatten().fieldErrors;
    Object.entries(zodErrors).forEach(
      ([field, messages]: [string, unknown]) => {
        // As currently typed, this method could be called with any type of
        // ZodError, so we need to check if the messages are an array of strings.
        if (!Array.isArray(messages) || typeof messages[0] !== "string") {
          return;
        }

        const message = messages?.[0];
        if (message) {
          errors[field as keyof T] = message;
        }
      },
    );
    return errors;
  }

  /*
   * Create a new regular user.
   */
  async create(data: CreateUserDto) {
    this.validateCreate(data);
    data.password = await this.hash.make(data.password);
    return this.userRepository.create({ ...data, isGuest: false });
  }

  async createGuest() {
    return this.userRepository.create({ isGuest: true });
  }

  /**
   * Update a user's information.
   */
  async update(id: number, data: UpdateUserDto) {
    this.validateUpdate(data);
    if (data.password) {
      data.password = await this.hash.make(data.password);
    }
    return this.userRepository.update(id, data);
  }

  /**
   * Promote a guest user to a regular user.
   */
  async promote(id: number, data: CreateUserDto) {
    this.validateUpdate(data);
    if (data.password) {
      data.password = await this.hash.make(data.password);
    }
    return this.userRepository.update(id, { ...data, isGuest: false });
  }
}
