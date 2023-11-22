import ReactWrapBalancer from "react-wrap-balancer";
import Link from "next/link";
import { ArrowRightIcon, RssIcon } from "@heroicons/react/24/outline";
import ButtonPrimary from "../ui/buttons/button";

const Hero: React.FC = () => {
  return (
    <section>
      <header className="absolute z-30 w-full">
        <div className="max-w-6xl px-4 mx-auto sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="mr-4 shrink-0 flex ml-2 md:mr-24">
              <RssIcon className="h-8 mr-3" />
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                Genetera
              </span>
            </Link>

            {/* Desktop navigation */}
            <nav className="flex grow">
              {/* Desktop sign in links */}
              <ul className="flex flex-wrap items-center justify-end grow">
                <li>
                  <Link href="/app/sign-in/">
                    <ButtonPrimary>Sign in</ButtonPrimary>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <div className="relative max-w-6xl min-h-screen px-4 mx-auto sm:px-6">
        <div className="pt-32 pb-16 md:pt-52 md:pb-32">
          {/* Hero content */}
          <div className="container mx-auto text-center">
            <div className="mb-6" data-aos="fade-down">
              <div className="relative inline-flex before:absolute before:inset-0 ">
                <Link
                  className="px-3 py-1 text-sm font-medium inline-flex items-center justify-center border border-transparent rounded-full  text-black hover:text-zink-200 transition duration-150 ease-in-out w-full group  relative before:absolute before:inset-0 border-zinc-600 before:rounded-full before:pointer-events-none"
                  href="https://github.com/genetera/genetera"
                  target="_blank"
                >
                  <span className="relative inline-flex items-center">
                    Genetera is Open Source{" "}
                    <ArrowRightIcon className="w-3 h-3 tracking-normal text-primary-500 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1" />
                  </span>
                </Link>
              </div>
            </div>
            <h1
              className="pb-4 font-extrabold  text-7xl lg:text-8xl   text-zinc-900"
              data-aos="fade-down"
            >
              <ReactWrapBalancer>
                AI-Powered content generator.
              </ReactWrapBalancer>
            </h1>
            <p
              className="mb-8 text-lg text-zinc-900"
              data-aos="fade-down"
              data-aos-delay="200"
            >
              Create viral contents for Instagram, X, Linkedin, Facebook,
              Articles using LLMs.
            </p>
            <div
              className="flex flex-col items-center max-w-xs mx-auto gap-4 sm:max-w-none  sm:justify-center sm:flex-row sm:inline-flex"
              data-aos="fade-down"
              data-aos-delay="400"
            >
              <Link href="/app/sign-in/">
                <ButtonPrimary>
                  <div className="justify-center items-center flex">
                    <span>Get Started</span>
                    <ArrowRightIcon className="w-3 h-3 tracking-normal text-primary-500 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1" />
                  </div>
                </ButtonPrimary>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
