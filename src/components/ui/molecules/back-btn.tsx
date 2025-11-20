import { useRouter as useNextRouter } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa";
import { Button, ButtonProps } from "../atoms/button";

// Define the variant types explicitly
type ButtonVariant = ButtonProps["variant"];

// Define a type for the router object used by the component
interface AppRouter {
  back: () => void;
  push: (href: string) => void;
  // Add other router methods used by the component if any
}

interface BackButtonProps {
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonProps["size"];
  // Add optional router prop for testing/storybook
  router?: AppRouter;
}

const BackButton = ({ className, variant = "default", size = "md", router: routerProp }: BackButtonProps) => {
  const nextRouter = useNextRouter();
  // Use the prop if provided, otherwise use the hook
  const router = routerProp ?? nextRouter;

  const handleGoBack = () => {
    // Check if window.history is available (not in SSR or some test environments)
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    // <Tooltip content='Go back' position='right' className={`${className} text-nowrap w-fit`}>
    <Button
      title='Back'
      onClick={handleGoBack}
      variant={variant}
      size={size}
      className={`${className} hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-2`}
    >
      <FaChevronLeft size={14} />
    </Button>
    // </Tooltip>
  );
};

export default BackButton;
