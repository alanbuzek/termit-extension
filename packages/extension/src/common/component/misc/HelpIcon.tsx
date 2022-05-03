import * as React from "react";
import { InfoIconProps } from "./InfoIcon";
import classNames from "classnames";
import { FaQuestionCircle } from "react-icons/fa";
import { Popover, PopoverBody, PopoverHeader } from "reactstrap";
import { useI18n } from "../hook/useI18n";


const HelpIcon: React.FC<InfoIconProps> = (props) => {
  const cls = classNames("info-icon", "help-icon", props.className);
  const { i18n } = useI18n();
  const [open, setOpen] = React.useState(false);
  const show = () => setOpen(true);
  const mouseOut = () => {
    setOpen(false);
  };

  return (
    <>
      <FaQuestionCircle
        id={props.id}
        className={cls}
        onMouseOver={show}
        onMouseOut={mouseOut}
      />
      <Popover
        target={props.id}
        placement={props.placement}
        isOpen={open}
        popperClassName="help-icon-popover"
      >
        <PopoverHeader
        >
          {i18n("help.title")}
        </PopoverHeader>
        <PopoverBody>{props.text}</PopoverBody>
      </Popover>
    </>
  );
};

export default HelpIcon;
