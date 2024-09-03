import { auth, signOut } from "auth";

export default async function SettingsPage() {
  const session = await auth();
  return (
    <div>
      {JSON.stringify(session)}
      {/* <div><strong>User Name:</strong> {user.name || 'N/A'}</div>
      <div><strong>User Email:</strong> {user.email || 'N/A'}</div>
      <div><strong>User Image:</strong> {user.image || 'N/A'}</div>
      <div><strong>Session Expiry:</strong> {expires || 'N/A'}</div>
      <form action={async () => {
        'use server'
        await signOut()
      }}>
        <button type='submit'>Sign Out</button>
      </form> */}
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
    </div>
  );
}
