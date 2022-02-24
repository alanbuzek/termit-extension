import * as React from "react";
import { ButtonToolbar } from "reactstrap";
import { Popover, PopoverBody, PopoverHeader } from '../SelectionPurposeDialog';

interface PopupWithActionsProps {
  title: string;
  actions: JSX.Element[];
  component: JSX.Element;
  isOpen: boolean;
  target: any;
  toggle: any;
}

const handler = (e: any) => {
  console.log('propagation stopped')
  // e.stopPropagation();
};

const SimplePopupWithActions: React.FC<PopupWithActionsProps> = (props) => {
  if (!props.isOpen) {
    return null;
  }
  return (
    <Popover>
      <div onClick={handler}>
        <PopoverHeader className="d-flex align-items-center">
          <div className="pwa-popup-title flex-grow-1">{props.title}</div>
          <ButtonToolbar className="float-sm-right">
            {props.actions}
          </ButtonToolbar>
        </PopoverHeader>
        <PopoverBody>{props.component}</PopoverBody>
      </div>
    </Popover>
  );
};

export default SimplePopupWithActions;
