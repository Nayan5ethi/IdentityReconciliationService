import cors from "cors";

const corsOptions: cors.CorsOptions = {
  credentials: true,
  origin: (origin, cb) => {
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin
    return cb(null, origin);
  },
};

export default corsOptions;
