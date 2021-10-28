import { vec4 } from "gl-matrix";

export const Vec4Colors = {
  White: vec4.fromValues(1.0, 1.0, 1.0, 1.0),
  Black: vec4.fromValues(0.0, 0.0, 0.0, 1.0),
  Red: vec4.fromValues(1.0, 0.0, 0.0, 1.0),
  Green: vec4.fromValues(0.0, 1.0, 0.0, 1.0),
  Blue: vec4.fromValues(0.0, 0.0, 1.0, 1.0),
  Yellow: vec4.fromValues(1.0, 1.0, 0.0, 1.0),
  DarkGrey: vec4.fromValues(0.25, 0.25, 0.25, 1.0),
  Grey: vec4.fromValues(0.5, 0.5, 0.5, 1.0),
  LightGrey: vec4.fromValues(0.75, 0.75, 0.75, 1.0),
};
export const Vec4Basics = {
  Zero: vec4.fromValues(0.0, 0.0, 0.0, 1.0),
  X: vec4.fromValues(1.0, 0.0, 0.0, 1.0),
  Y: vec4.fromValues(0.0, 1.0, 0.0, 1.0),
  Z: vec4.fromValues(0.0, 0.0, 1.0, 1.0),
};
