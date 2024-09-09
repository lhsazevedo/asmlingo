export default function Page() {
  async function signup(formData: FormData) {
    "use server";

    // TODO: Validate input
  }

  return (
    <form action={signup}>
      <label>
        Name (optional)
        <input type="text" name="name" />
      </label>
      <label>
        Email
        <input type="email" name="email" />
      </label>
      <label>
        Password
        <input type="password" name="password" />
      </label>
      <button type="submit">Sign up</button>
    </form>
  );
}
