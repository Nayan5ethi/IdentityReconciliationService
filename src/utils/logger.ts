import winston, { createLogger, format, transports } from "winston";

const { combine, colorize, printf } = format;

const messageFormat = printf(({ level, message }) => {
  return `${new Date()} ${level}: ${message}`;
});

const level = () => {
  return "debug";
};

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const logger = createLogger({
  level: level(),
  levels,
  format: combine(
    format((info) => {
      info.level = info.level.toUpperCase();
      return info;
    })(),
    colorize({ all: true }),
    format.errors({ stack: true }),
    format.splat(),
    messageFormat
  ),
  transports: [new transports.Console()],
});

export default logger;
