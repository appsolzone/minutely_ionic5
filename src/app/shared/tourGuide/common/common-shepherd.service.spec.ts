import { TestBed } from "@angular/core/testing";
import { CommonShepherdService } from "./common-shepherd.service";

describe("CommonShepherdService", () => {
  let service: CommonShepherdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonShepherdService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
