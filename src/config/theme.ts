type stringKey = Record<string, object>;
export const theme: stringKey = {
  light: {
    colors: {
      primary: {
        primary1: "#7C67FF",
      },
      secondary: {
        secondary1: "#3FF9AF",
        secondary2: "#FF4778",
        secondary3: "#FFB547",
      },
      border: { border1: "#272341", border2: "#FF4778", border3: "#7C67FF" },
      background: {
        background1: "#121212",
        background2: "#1B1B21",
      },
      text: {
        text1: "#FFF",
        text2: "rgba(255, 255, 255, 0.5)",
        text3: "#3FF9AF",
        text4: "#FF4778",
        text5: "#7C67FF",
        text6: "#FFB547",
      },
    },
    fontSize: {
      title: {
        title0: "20px",
        title1: "18px",
        title2: "16px",
        title3: "14px",
        title4: "12px",
        title5: "10px",
      },
      paragraph: {
        min: "10px",
        small: "12px",
        medium: "14px",
        reguar: "16px",
      },
    },
  },
  dark: {
    colors: {
      primary: {},
      secondary: {},
      border: {},
      background: {},
      text: {},
    },
    fontSize: {
      title: {},
      paragraph: {},
    },
  },
};
//主题类型
export const themeMode: [string] = ["light"];
