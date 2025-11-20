import "@/app/globals.css";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className='flex flex-col h-screen'>
      <header className='flex justify-between items-center w-full max-w-[400px] mx-auto p-4' role='banner'>
        {/* <Logo /> */}
      </header>
      <main className='flex flex-grow items-center justify-center' role='main'>
        {children}
      </main>
      <footer className='text-center p-4' role='contentinfo'>
        <p>&copy; {new Date().getFullYear()} MediGadget. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
