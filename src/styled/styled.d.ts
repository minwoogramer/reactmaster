import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    name: "light" | "dark";
    bgColor: string;
    textColor: string;
    accentColor: string;
  }
}
