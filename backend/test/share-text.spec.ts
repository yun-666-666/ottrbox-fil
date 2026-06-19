import { BadRequestException, NotFoundException } from "@nestjs/common";
import { test } from "node:test";
import * as assert from "node:assert/strict";
import { ShareDTO } from "../src/share/dto/share.dto";
import { ShareService } from "../src/share/share.service";

const createShareService = (share: any) => {
  const prisma = {
    share: {
      findUnique: async () => share,
      update: async ({ data }: any) => ({ ...share, ...data }),
    },
    reverseShare: {
      update: async () => undefined,
    },
  };

  return new ShareService(
    prisma as any,
    { get: () => false } as any,
    {} as any,
    { sendMailToShareRecipients: async () => undefined } as any,
    { get: () => false } as any,
    {} as any,
    {} as any,
    { checkAndRemove: async () => undefined } as any,
  );
};

test("complete locks a text share even when it has no files", async () => {
  const share = {
    id: "text-code",
    files: [],
    text: "hello from a text share",
    recipients: [],
    creator: null,
    reverseShare: null,
    uploadLocked: false,
  };
  const service = createShareService(share);

  const completed = await service.complete("text-code");

  assert.equal(completed.uploadLocked, true);
});

test("complete still rejects an empty non-text share", async () => {
  const share = {
    id: "empty-code",
    files: [],
    text: null,
    recipients: [],
    creator: null,
    reverseShare: null,
    uploadLocked: false,
  };
  const service = createShareService(share);

  await assert.rejects(
    () => service.complete("empty-code"),
    BadRequestException,
  );
});

test("share dto exposes text content", () => {
  const dto = new ShareDTO().from({
    id: "text-code",
    expiration: new Date(),
    files: [],
    text: "copy this",
  } as any);

  assert.equal(dto.text, "copy this");
});

test("passcode lookup returns a completed share", async () => {
  const share = {
    id: "text-code",
    uploadLocked: true,
    expiration: new Date(0),
  };
  const service = createShareService(share);

  const result = await service.getPasscodeShare("text-code");

  assert.equal(result.id, "text-code");
});

test("passcode lookup rejects unfinished shares", async () => {
  const share = {
    id: "draft-code",
    uploadLocked: false,
    expiration: new Date(0),
  };
  const service = createShareService(share);

  await assert.rejects(
    () => service.getPasscodeShare("draft-code"),
    NotFoundException,
  );
});

test("passcode lookup rejects removed shares", async () => {
  const share = {
    id: "removed-code",
    uploadLocked: true,
    removedReason: "Removed",
    expiration: new Date(0),
  };
  const service = createShareService(share);

  await assert.rejects(
    () => service.getPasscodeShare("removed-code"),
    NotFoundException,
  );
});
