import { FC } from "react";
import { useNavigate } from "react-router-dom";

export const withRouter = (Component: FC) => {
  const Wrapper = (props: any) => {
    const history = useNavigate();
    return <Component history={history} {...props} />;
  };
  return Wrapper;
};
