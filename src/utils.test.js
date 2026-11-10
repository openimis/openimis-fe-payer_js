import { describe, expect, it } from "vitest";

import { toInputValues, validatePayerForm } from "./utils";

const complete = {
  name: "Ministry of Health",
  type: "G",
  location: { uuid: "loc-1", name: "Region" },
  address: "1 Main St",
};

describe("validatePayerForm", () => {
  it("accepts a payer with a name, type, location and address", () => {
    expect(validatePayerForm(complete)).toBe(true);
  });

  it.each(["name", "type", "location", "address"])("rejects a payer without a %s", (field) => {
    expect(validatePayerForm({ ...complete, [field]: undefined })).toBe(false);
  });

  it("does not require the contact details", () => {
    expect(validatePayerForm({ ...complete, phone: "", email: "", fax: "" })).toBe(true);
  });

  it("rejects a historical version of a payer", () => {
    expect(validatePayerForm({ ...complete, validityTo: "2024-01-01" })).toBe(false);
  });
});

describe("toInputValues", () => {
  it("sends the location as its uuid and keeps only the fields the mutation accepts", () => {
    const payer = {
      ...complete,
      id: "UGF5ZXJHUUxUeXBlOjE=",
      uuid: "payer-1",
      fax: "123",
      email: "moh@example.org",
      phone: "456",
      validityFrom: "2020-01-01",
      validityTo: null,
    };

    expect(toInputValues(payer)).toEqual({
      uuid: "payer-1",
      name: "Ministry of Health",
      locationUuid: "loc-1",
      type: "G",
      address: "1 Main St",
      fax: "123",
      email: "moh@example.org",
      phone: "456",
    });
  });

  it("tolerates a payer with no location yet", () => {
    expect(toInputValues({ name: "New" }).locationUuid).toBeUndefined();
  });
});
