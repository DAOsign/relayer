import { debugAuthority } from "../services/debug";

debugAuthority().catch((e) => {
  const errorKeys = Object.keys(e) || ["code", "action", "data", "reason", "shortMessage"];
  console.log(e);
  /* console.log(typeof e);

  console.log(e.message); */
});
