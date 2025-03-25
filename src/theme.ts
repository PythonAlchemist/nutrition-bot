import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#e3f8ff",
      100: "#b3e7ff",
      200: "#80d5ff",
      300: "#4dc3ff",
      400: "#26b2ff",
      500: "#00a0ff",
      600: "#007ecc",
      700: "#005c99",
      800: "#003a66",
      900: "#001833",
    },
    accent: {
      50: "#ffe5f8",
      100: "#ffb3e6",
      200: "#ff80d4",
      300: "#ff4dc2",
      400: "#ff1ab0",
      500: "#ff009e",
      600: "#cc007e",
      700: "#99005e",
      800: "#66003f",
      900: "#33001f",
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "brand",
      },
      variants: {
        solid: (props: any) => ({
          bg:
            props.colorScheme === "brand"
              ? "brand.500"
              : `${props.colorScheme}.500`,
          color: "white",
          _hover: {
            bg:
              props.colorScheme === "brand"
                ? "brand.600"
                : `${props.colorScheme}.600`,
            transform: "translateY(-2px)",
            boxShadow: "lg",
          },
          _active: {
            bg:
              props.colorScheme === "brand"
                ? "brand.700"
                : `${props.colorScheme}.700`,
            transform: "translateY(0)",
          },
          transition: "all 0.2s",
        }),
      },
    },
    Container: {
      baseStyle: {
        px: { base: 4, md: 8 },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "gray.800",
      },
    },
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

export default theme;
