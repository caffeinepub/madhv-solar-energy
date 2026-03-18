import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

actor {
  type ContactFormSubmission = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Time.Time;
  };

  module ContactFormSubmission {
    public func compare(submission1 : ContactFormSubmission, submission2 : ContactFormSubmission) : Order.Order {
      Int.compare(submission1.timestamp, submission2.timestamp);
    };
  };

  type CompanyInfo = {
    companyName : Text;
    address : Text;
    phone : Text;
    email : Text;
  };

  let contactFormSubmissions = Map.empty<Time.Time, ContactFormSubmission>();

  var companyInfo : ?CompanyInfo = null;
  let admin = Principal.fromText("2vxsx-fae");

  public shared ({ caller }) func setCompanyInfo(
    companyName : Text,
    address : Text,
    phone : Text,
    email : Text,
  ) : async () {
    if (caller != admin) {
      Runtime.trap("Only admin can set company info");
    };
    let info : CompanyInfo = {
      companyName;
      address;
      phone;
      email;
    };
    companyInfo := ?info;
  };

  public query ({ caller }) func getCompanyInfo() : async ?CompanyInfo {
    companyInfo;
  };

  public shared ({ caller }) func submitContactForm(name : Text, email : Text, message : Text) : async () {
    let submission : ContactFormSubmission = {
      name;
      email;
      message;
      timestamp = Time.now();
    };
    contactFormSubmissions.add(submission.timestamp, submission);
  };

  public query ({ caller }) func getAllContactFormSubmissions() : async [ContactFormSubmission] {
    let values = contactFormSubmissions.values().toArray().sort();
    return values.reverse();
  };
};
