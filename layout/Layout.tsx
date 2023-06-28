import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <div>
        <Navbar />
        <div className="min-h-screen pt-20">
          <main>{children}</main>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default Layout