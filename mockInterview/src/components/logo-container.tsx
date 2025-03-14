import { Link } from "react-router-dom";

export const LogoContainer = () => {
  return (
    <Link to={"/"}>
      <img
        src="/assets/img/logo/logo.jpeg"
        alt=""
        style={{width: "170px", height: "70px"}}
      />
    </Link>
  );
};
