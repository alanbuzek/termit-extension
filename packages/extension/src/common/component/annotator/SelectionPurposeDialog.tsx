import * as React from "react";
import { Button, ButtonToolbar } from "reactstrap";
import { TiTimes } from "react-icons/ti";
import { useI18n } from "../hook/useI18n";
// import { useI18n } from "../hook/useI18n";

// i18n mock
// export const useI18n = () => (
//   {
//     i18n: (str) => str.split('.').at(-1)
//   }
// )
interface SelectionPurposeDialogProps {
  target?: string | HTMLElement;
  show: boolean;
  onCreateTerm: () => void;
  onMarkOccurrence: () => void;
  onMarkDefinition: () => void;
  onCancel: () => void;
}

function handler(e: any) {
  return e.stopPropagation();
}

// mock popover components
export const Popover = ({ children, className = "" }) => {
  return <div className={`popover ${className}`}>{children}</div>;
};

export const PopoverHeader = ({ children, className = "" }) => {
  return <div className={`popover-header ${className}`}>{children}</div>;
};

export const PopoverBody = ({ children, className = "" }) => {
  return <div className={`popover-body ${className}`}>{children}</div>;
};

export const SelectionPurposeDialog: React.FC<SelectionPurposeDialogProps> = (
  props
) => {
  const { i18n } = useI18n();
  // if (!props.show || !props.target) {
  //   return null;
  // }
  return (
    <Popover>
      <div onClick={handler}>
        <PopoverHeader className="d-flex align-items-center">
          <div className="flex-grow-1">
            {i18n("annotator.selectionPurpose.dialog.title")}
          </div>
          <div className="ml-2 flex-grow-0 float-right">
            <Button
              id="annotator-selection-dialog-cancel"
              onClick={props.onCancel}
              color="primary"
              size="sm"
            >
              <TiTimes />
            </Button>
          </div>
        </PopoverHeader>
        <PopoverBody>
          <ButtonToolbar className="flex-nowrap">
            <Button
              id="annotator-selection-dialog-mark-occurrence"
              color="primary"
              size="sm"
              className="flex-grow-1"
              onClick={props.onMarkOccurrence}
            >
              {i18n("annotator.selectionPurpose.occurrence")}
            </Button>
            <Button
              id="annotator-selection-dialog-mark-definition"
              color="primary"
              size="sm"
              className="flex-grow-1"
              onClick={props.onMarkDefinition}
            >
              {i18n("annotator.selectionPurpose.definition")}
            </Button>
          </ButtonToolbar>
        </PopoverBody>
      </div>
    </Popover>
  );
};

export default SelectionPurposeDialog;
