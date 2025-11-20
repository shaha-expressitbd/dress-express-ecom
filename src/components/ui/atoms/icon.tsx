import { IconType } from "react-icons";

interface IconProps {
  icon: IconType;
  size?: number;
  color?: string;
  className?: string;
}

export const Icon = ({
  icon: IconComponent,
  size = 20,
  color,
  className,
}: IconProps) => {
  return (
    <IconComponent
      className={className}
      style={{
        width: size,
        height: size,
        color: color,
      }}
    />
  );
};
