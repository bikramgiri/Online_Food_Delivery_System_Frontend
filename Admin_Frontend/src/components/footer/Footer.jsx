const Footer = () => {
  return (
    <div className="bg-blue-500 flex w-full flex-col items-center justify-between px-1 pb-8 pt-4 lg:px-8 xl:flex-row">
      <h5 className="mb-4 text-center text-sm font-medium text-white sm:!mb-0 md:text-lg">
        <p className="mb-4 text-center text-sm text-white sm:!mb-0 md:text-base">
          ©{1900 + new Date().getYear()} Foods Hub. All Rights Reserved.
        </p>
      </h5>
      <div>
        <ul className="flex flex-wrap items-center gap-3 sm:flex-nowrap md:gap-10">
          <li>
            <a
              target="blank"
              href="mailto:hello@simmmple.com"
              className="text-base font-medium text-white"
            >
              Support
            </a>
          </li>
          <li>
            <a
              target="blank"
              href="https://simmmple.com/licenses"
              className="text-base font-medium text-white"
            >
              License
            </a>
          </li>
          <li>
            <a
              target="blank"
              href="https://simmmple.com/terms-of-service"
              className="text-base font-medium text-white"
            >
              Terms of Use
            </a>
          </li>
          <li>
            <a
              target="blank"
              href="https://blog.horizon-ui.com/"
              className="text-base font-medium text-white"
            >
              Blog
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
