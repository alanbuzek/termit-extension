import * as React from "react";
import { ButtonToolbar } from "reactstrap";

const Popover = ({ children, className = "" }) => {
  return <div className={`popover ${className}`}>{children}</div>;
};

const PopoverHeader = ({ children, className = "", style = {} }) => {
  return (
    <div className={`popover-header ${className}`} style={style}>
      {children}
    </div>
  );
};

const PopoverBody = ({ children, className = "", style = {} }) => {
  return (
    <div className={`popover-body ${className}`} style={style}>
      {children}
    </div>
  );
};

interface PopupWithActionsProps {
  title: string;
  actions: JSX.Element[];
  component: JSX.Element;
}

const SimplePopupWithActions: React.FC<PopupWithActionsProps> = (props) => {
  return (
    <Popover className="border border-gray-400  rounded-md">
      <div>
        <PopoverHeader className="d-flex align-items-center px-1 pb-1 pt-1.5 !bg-gray-100 !border !border-gray-300">
          <div className="pwa-popup-title flex-grow-1 px-1 ml-0.5 text-gray-600 font-semibold">
            {props.title}
          </div>
          <ButtonToolbar className="float-sm-right">
            {props.actions}
          </ButtonToolbar>
        </PopoverHeader>
        <PopoverBody className="px-2 pb-2 pt-2 rounded-b-md !bg-gray-100 !border !border-t-0 !border-gray-300">
          {props.component}
        </PopoverBody>
      </div>
    </Popover>
  );
};

export default SimplePopupWithActions;
