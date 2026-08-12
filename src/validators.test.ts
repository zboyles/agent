import type { GenericId, Infer } from "convex/values";
import { expect, expectTypeOf, test } from "vitest";
import type { ContextOptions, StorageOptions } from "./client/types.js";
import {
  vContextOptions,
  vMessageDoc,
  vStorageOptions,
  vTextArgs,
} from "./validators.js";
import type { Doc } from "./component/_generated/dataModel.js";
import { validate } from "convex-helpers/validators";

expectTypeOf<Infer<typeof vContextOptions>>().toExtend<ContextOptions>();
expectTypeOf<ContextOptions>().toExtend<Infer<typeof vContextOptions>>();

expectTypeOf<Infer<typeof vStorageOptions>>().toExtend<StorageOptions>();
expectTypeOf<StorageOptions>().toExtend<Infer<typeof vStorageOptions>>();

type MessageBasedOnSchema = IdsToStrings<
  Omit<Doc<"messages">, "files" | "stepId" | "parentMessageId">
>;
expectTypeOf<Infer<typeof vMessageDoc>>().toEqualTypeOf<MessageBasedOnSchema>();
expectTypeOf<MessageBasedOnSchema>().toEqualTypeOf<Infer<typeof vMessageDoc>>();

test("noop", () => {});

test("text args accept instructions and the deprecated system alias", () => {
  expect(
    validate(vTextArgs, { prompt: "hello", instructions: "primary" }),
  ).toBeTruthy();
  expect(
    validate(vTextArgs, { prompt: "hello", system: "legacy" }),
  ).toBeTruthy();
});

type IdsToStrings<T> =
  T extends GenericId<string>
    ? string
    : T extends (infer U)[]
      ? IdsToStrings<U>[]
      : T extends ArrayBuffer
        ? ArrayBuffer
        : T extends object
          ? { [K in keyof T]: IdsToStrings<T[K]> }
          : T;
