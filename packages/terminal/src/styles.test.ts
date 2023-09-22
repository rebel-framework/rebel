import * as styles from './styles';
import { escapeAnsii } from './ansii';
import { TextStyle, TextColor, BackgroundColor } from './enums';

jest.mock('./ansii', () => ({
  ...jest.requireActual('./ansii'),
  escapeAnsii: jest.fn((code: string) => `\x1b[${code}m`),
  supportsAnsiiEscapes: jest.fn(),
}));

describe('styles', () => {
  beforeEach(() => {
    (escapeAnsii as jest.Mock).mockClear();
  });

  const textStyles = {
    bold: TextStyle.Bold,
    dim: TextStyle.Dim,
    italic: TextStyle.Italic,
    underline: TextStyle.Underline,
    blink: TextStyle.Blink,
    reverse: TextStyle.Reverse,
    hidden: TextStyle.Hidden,
    strikethrough: TextStyle.Strikethrough,
  };

  for (const [funcName, textStyle] of Object.entries(textStyles)) {
    it(`formats text as ${funcName}`, () => {
      const func = styles[funcName];
      expect(func('test')).toBe(
        `\x1b[${textStyle}mtest\x1b[${TextStyle.Reset}m`
      );
    });
  }

  const textColors = {
    defaultColor: TextColor.Default,
    black: TextColor.Black,
    red: TextColor.Red,
    green: TextColor.Green,
    yellow: TextColor.Yellow,
    blue: TextColor.Blue,
    magenta: TextColor.Magenta,
    cyan: TextColor.Cyan,
    lightGray: TextColor.LightGray,
    darkGray: TextColor.DarkGray,
    lightRed: TextColor.LightRed,
    lightGreen: TextColor.LightGreen,
    lightYellow: TextColor.LightYellow,
    lightBlue: TextColor.LightBlue,
    lightMagenta: TextColor.LightMagenta,
    lightCyan: TextColor.LightCyan,
    white: TextColor.White,
  };

  for (const [funcName, textColor] of Object.entries(textColors)) {
    it(`formats text with ${funcName}`, () => {
      const func = styles[funcName];
      expect(func('test')).toBe(
        `\x1b[${textColor}mtest\x1b[${TextStyle.Reset}m`
      );
    });
  }

  const backgroundColors = {
    backgroundDefault: BackgroundColor.Default,
    backgroundBlack: BackgroundColor.Black,
    backgroundRed: BackgroundColor.Red,
    backgroundGreen: BackgroundColor.Green,
    backgroundYellow: BackgroundColor.Yellow,
    backgroundBlue: BackgroundColor.Blue,
    backgroundMagenta: BackgroundColor.Magenta,
    backgroundCyan: BackgroundColor.Cyan,
    backgroundLightGray: BackgroundColor.LightGray,
    backgroundDarkGray: BackgroundColor.DarkGray,
    backgroundLightRed: BackgroundColor.LightRed,
    backgroundLightGreen: BackgroundColor.LightGreen,
    backgroundLightYellow: BackgroundColor.LightYellow,
    backgroundLightBlue: BackgroundColor.LightBlue,
    backgroundLightMagenta: BackgroundColor.LightMagenta,
    backgroundLightCyan: BackgroundColor.LightCyan,
    backgroundWhite: BackgroundColor.White,
  };

  for (const [funcName, bgColor] of Object.entries(backgroundColors)) {
    it(`formats text with ${funcName}`, () => {
      const func = styles[funcName];
      expect(func('test')).toBe(`\x1b[${bgColor}mtest\x1b[${TextStyle.Reset}m`);
    });
  }
});
