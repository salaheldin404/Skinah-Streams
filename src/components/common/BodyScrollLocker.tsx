"use client";
import { useLockBodyScroll } from "@uidotdev/usehooks";

const BodyScrollLocker = () => {
  useLockBodyScroll();
  return null;
};

export default BodyScrollLocker;
