import { debugAuthority, debugVoid } from "../services/debug/ethereum";

debugVoid()
  .then((res) => {
    console.log("res", res);
  })
  .catch((e) => {
    const errorKeys = Object.keys(e) || ["code", "action", "data", "reason", "shortMessage"];
    console.log(e);
    /* console.log(typeof e);

  console.log(e.message); */
  });
