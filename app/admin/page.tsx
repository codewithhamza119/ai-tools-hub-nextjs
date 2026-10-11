import { getCatalog } from '@/lib/catalog';
import { isAdminAuthed } from './actions';
import LoginForm from './LoginForm';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin — AI Tools HuB',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!process.env.ADMIN_PASSWORD) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4">
        <div className="glass w-full rounded-2xl p-6 text-center">
          <h1 className="text-xl font-extrabold">Admin not configured</h1>
          <p className="mt-2 text-sm text-slate-400">
            Set the <code className="text-cyan-300">ADMIN_PASSWORD</code> environment variable and
            redeploy to enable the admin panel.
          </p>
        </div>
      </div>
    );
  }

  if (!(await isAdminAuthed())) {
    return <LoginForm />;
  }

  const products = await getCatalog();
  return <AdminDashboard products={products} />;
}
