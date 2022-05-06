import * as React from "react";
import { ButtonToolbar } from "reactstrap";
import { Popover, PopoverBody, PopoverHeader } from "./SelectionPurposeDialog";

interface PopupWithActionsProps {
  title: string;
  actions: JSX.Element[];
  component: JSX.Element;
  isOpen: boolean;
  toggle: any;
}

const handler = (e: any) => {
  // TODO: just delte?
};

const SimplePopupWithActions: React.FC<PopupWithActionsProps> = (props) => {
  if (!props.isOpen) {
    return null;
  }
  return (
    <Popover className="border border-gray-400  rounded-md">
      <div onClick={handler}>
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
