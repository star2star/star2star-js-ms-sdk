/* global require module*/
"use strict";
const util = require("./utilities");
const request = require("./requestPromise");
const logger = require("./node-logger").getInstance();

/**
 * @async
 * @description - This function will assign numbers a SMS 10DLC Campaign
 * @param {string} [accessToken="null accessToken"] cpaas access token
 * @param {string} [accountUUID="null accountUUID"] cpaas account uuid to provision
 * @param {string} [campaignId="null campaignId"] 10dlc campaign id
 * @param {array} [numbers=[]] array of numbers to assign
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a object confirming the assignment of numbers
 */
const assignToSMSCampaign = async (
  accessToken = "null accessToken",
  accountUUID = "null accountUUID",
  campaignId = [],
  numbers,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("campaigns");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/10dlc/customers/${accountUUID}/campaigns/${campaignId}/numbers/assign`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-type": "application/json",
      },
      body: {
        tns: numbers,
      },
      json: true,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description - This function will create a SMS 10DLC Brand
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [accountUUID] - account uuid to provision on behalf of
 * @param {string} legalName company legal name
 * @param {string} brandName brand name
 * @param {string} organizationType organization type
 * @param {string} [registrationCountry="US"] registration country
 * @param {string} taxId tax id
 * @param {string} [taxIdCountry="US"] tax country
 * @param {string} altBusinessIdType alternate business type
 * @param {string} altBusinessId alternate business id
 * @param {string} vertical business vertical
 * @param {string} address legal streed address
 * @param {string} city legal address city
 * @param {string} state legal address state
 * @param {string} postalCode legal address postal code
 * @param {string} website company website
 * @param {string} stockSymbol public stock symbol
 * @param {string} stockExchange public stock exchange
 * @param {string} emailAddress contact email address
 * @param {string} phoneNumber contact phone number
 * @param {string} firstName contact first name
 * @param {string} lastName contact last name
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a object containing a new 10DLC Brand
 */
const createBrand = async (
  accessToken = "null accessToken",
  accountUUID = "null accountUUID",
  legalName,
  brandName,
  organizationType,
  registrationCountry = "US",
  taxId,
  taxIdCountry = "US",
  altBusinessIdType,
  altBusinessId,
  vertical,
  address,
  city,
  state,
  postalCode,
  website,
  stockSymbol,
  stockExchange,
  emailAddress,
  phoneNumber,
  firstName,
  lastName,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("campaigns");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/10dlc/customers`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-type": "application/json",
      },
      body: {
        legal_name: legalName,
        brand_name: brandName,
        organization_type: organizationType,
        registration_country: registrationCountry,
        e_i_n: taxId,
        e_i_n_country: taxIdCountry,
        alt_business_id_type: altBusinessIdType,
        alt_business_id: altBusinessId,
        vertical: vertical,
        address: address,
        city: city,
        state: state,
        postal_code: postalCode,
        website: website,
        stock_symbol: stockSymbol,
        stock_exchange: stockExchange,
        email_address: emailAddress,
        phone_number: phoneNumber,
        first_name: firstName,
        last_name: lastName,
        account_uuid: accountUUID,
      },
      json: true,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will register a campaign for a CPaaS account that has an active brand registration
 * @param {string} [accessToken="null accessToken"] CPaaS access token
 * @param {string} [accountUUID="null accountUUID"] CPaaS account uuid
 * @param {string} description summary description of this campaign between 40 and 4096 characters
 * @param {string} displayName a friendly name for the campaign
 * @param {string} sampleMsg1 sample message 1
 * @param {string} sampleMsg2 sample message 2
 * @param {string} sampleMsg3 sample message 3
 * @param {string} sampleMsg4 sample message 4
 * @param {string} sampleMsg5 sample message 5
 * @param {boolean} numPooling campaign utilize pool of phone numbers?
 * @param {boolean} directLending messages used for lending or loan arangements?
 * @param {boolean} embeddedLink messages contain embedded URLs?
 * @param {boolean} embeddedPhone messages contain embedded phone numbers?
 * @param {boolean} affMarketing message content controlled by affiliate marketing other than the brand?
 * @param {boolean} ageGated campaign includes age gated message content?
 * @param {string} usecaseId usecase id
 * @param {array} subUsecaseIds sub usecase ids (strings)
 * @param {string} [messageFlow="Users may opt-in by sending START to any number associated with the campaign. Users may also sign up to receive messages from this campaign via a website after accepting terms and conditions."] how subscribers are added or opt-in to the campaign
 * @param {boolean} [autoRenewal=true] subscription auto-renews?
 * @param {boolean} [subOptIn=true] provides automated opt-in?
 * @param {string} [optInKeywords="START"] opt-in keywords (comma separated)
 * @param {string} [optInMessage="You have replied \"START\" and will begin receiving messages again. Reply \"STOP\" to unsubscribe."] automated opt-in message
 * @param {boolean} [subOptOut=true] provides automated opt-out?
 * @param {string} [optOutKeywords="STOP"] opt-out key words (comma separated)
 * @param {string} [optOutMessage="You have been unsubscribed from the mailing list and will not receive any more messages. Send \"START\" to resubscribe."] automated opt-out message
 * @param {boolean} [subHelp=true] provides automated help?
 * @param {string} [helpKeywords="HELP"] help keywords (comma separated)
 * @param {string} [helpMessage="To unsubscribe, reply \"STOP\" to this number.  Msg&data rates may apply."] automated help message
 * @param {object} [trace={}] optional CPaaS lifecycle headers
 * @return {Promsise<object>} promise resolving to a brand registration document
 */
const createCampaign = async (
  accessToken = "null accessToken",
  accountUUID = "null accountUUID",
  description,
  displayName,
  sampleMsg1,
  sampleMsg2,
  sampleMsg3,
  sampleMsg4,
  sampleMsg5,
  numPooling,
  directLending,
  embeddedLink,
  embeddedPhone,
  affMarketing,
  ageGated,
  usecaseId,
  subUsecaseIds = [],
  messageFlow = "Users may opt-in by sending START to any number associated with the campaign. Users may also sign up to receive messages from this campaign via a website after accepting terms and conditions.",
  autoRenewal = true,
  subOptIn = true,
  optInKeywords = "START",
  optInMessage = "You have replied \"START\" and will begin receiving messages again. Reply \"STOP\" to unsubscribe.",
  subOptOut = true,
  optOutKeywords = "STOP",
  optOutMessage = "You have been unsubscribed from the mailing list and will not receive any more messages. Send \"START\" to resubscribe.",
  subHelp = true,
  helpKeywords = "HELP",
  helpMessage = "To unsubscribe, reply \"STOP\" to this number.  Msg&data rates may apply.",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("campaigns");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/10dlc/customers/${accountUUID}/campaigns`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-type": "application/json",
      },
      body: {
        description: description,
        display_name: displayName,
        message_flow: messageFlow,
        sample_msg1: sampleMsg1,
        sample_msg2: sampleMsg2,
        sample_msg3: sampleMsg3,
        sample_msg4: sampleMsg4,
        sample_msg5: sampleMsg5,
        sub_opt_in: subOptIn,
        sub_opt_out: subOptOut,
        sub_help: subHelp,
        num_pooling: numPooling,
        direct_lending: directLending,
        embedded_link: embeddedLink,
        embedded_phone: embeddedPhone,
        aff_marketing: affMarketing,
        age_gated: ageGated,
        usecase_id: usecaseId,
        sub_usecase_ids: subUsecaseIds,
        help_message: helpMessage,
        auto_renewal: autoRenewal,
        opt_in_keywords: optInKeywords,
        opt_out_keywords: optOutKeywords,
        help_keywords: helpKeywords,
        opt_in_message: optInMessage,
        opt_out_message: optOutMessage,
      },
      json: true,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description - This function will delete a SMS 10DLC Brand
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [accountUUID] - account uuid to provision on behalf of
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a object confirming the delete request was received
 */
const deleteBrand = async (
  accessToken = "null accessToken",
  accountUUID,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("campaigns");
    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/10dlc/customers/${accountUUID}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-type": "application/json",
      },
      json: true,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description - This function will delete a campaign from a SMS 10DLC Brand / CPaaS account
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [accountUUID] - CPaaS account uuid
 * @param {string} [campaignId="null campaignId"] 10DLC campaign id to retrieve
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a object containing a CPaaS account 10DLC brand registrations
 */
const deleteCampaign = async (
  accessToken = "null accessToken",
  accountUUID,
  campaignId,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("campaigns");
    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/10dlc/customers/${accountUUID}/campaigns/${campaignId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-type": "application/json",
      },
      json: true,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description - This function will get a SMS 10DLC Brand
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [accountUUID] - account uuid to provision on behalf of
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a object containing a CPaaS account 10DLC brand registrations
 */
const getBrand = async (
  accessToken = "null accessToken",
  accountUUID,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("campaigns");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/10dlc/customers/${accountUUID}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-type": "application/json",
      },
      json: true,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description - This function will get campaign options for a SMS 10DLC Brand
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [accountUUID] - account uuid to provision on behalf of
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a object containing a CPaaS account 10DLC brand registrations
 */
const getBrandUseCases = async (
  accessToken = "null accessToken",
  accountUUID,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("campaigns");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/10dlc/customers/${accountUUID}/usecases`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-type": "application/json",
      },
      json: true,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description - This function will get a campaign for a SMS 10DLC Brand / CPaaS account
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [accountUUID] - CPaaS account uuid
 * @param {string} [campaignId="null campaignId"] 10DLC campaign id to retrieve
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a object containing a CPaaS account 10DLC brand registrations
 */
const getCampaign = async (
  accessToken = "null accessToken",
  accountUUID,
  campaignId,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("campaigns");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/10dlc/customers/${accountUUID}/campaigns/${campaignId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-type": "application/json",
      },
      json: true,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description - This function will deprovision numbers from a CPaaS account and/or user
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a object containing deprovisioning confirmation details
 */
const getEnumerations = async (
  accessToken = "null accessToken",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("campaigns");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/10dlc/help/get_enumerations`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-type": "application/json",
      },
      json: true,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description - This function will list campaigns for a SMS 10DLC Brand / CPaaS account
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [accountUUID] - CPaaS account uuid
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a object containing a CPaaS account 10DLC brand registrations
 */
const listCampaigns = async (
  accessToken = "null accessToken",
  accountUUID,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("campaigns");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/10dlc/customers/${accountUUID}/campaigns`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-type": "application/json",
      },
      json: true,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description - This function will remove numbers a SMS 10DLC Campaign
 * @param {string} [accessToken="null accessToken"] cpaas access token
 * @param {string} [accountUUID="null accountUUID"] cpaas account uuid to provision
 * @param {string} [campaignId="null campaignId"] 10dlc campaign id
 * @param {array} [numbers=[]] array of numbers to assign
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a object confirming the removal of numbers
 */
const removeFromSMSCampaign = async (
  accessToken = "null accessToken",
  accountUUID = "null accountUUID",
  campaignId = "null campaignId",
  numbers,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("campaigns");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/10dlc/customers/${accountUUID}/campaigns/${campaignId}/numbers/unassign`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-type": "application/json",
      },
      body: {
        tns: numbers,
      },
      json: true,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will update (re-register) a campaign for a CPaaS account that has an active brand registration
 * @param {string} [accessToken="null accessToken"] CPaaS access token
 * @param {string} [accountUUID="null accountUUID"] CPaaS account uuid
 * @param {string} [campaignId="null campaignId"] 10DLC campaign id to update
 * @param {string} description summary description of this campaign between 40 and 4096 characters
 * @param {string} displayName a friendly name for the campaign
 * @param {string} sampleMsg1 sample message 1
 * @param {string} sampleMsg2 sample message 2
 * @param {string} sampleMsg3 sample message 3
 * @param {string} sampleMsg4 sample message 4
 * @param {string} sampleMsg5 sample message 5
 * @param {boolean} numPooling campaign utilize pool of phone numbers?
 * @param {boolean} directLending messages used for lending or loan arangements?
 * @param {boolean} embeddedLink messages contain embedded URLs?
 * @param {boolean} embeddedPhone messages contain embedded phone numbers?
 * @param {boolean} affMarketing message content controlled by affiliate marketing other than the brand?
 * @param {boolean} ageGated campaign includes age gated message content?
 * @param {string} usecaseId usecase id
 * @param {array} subUsecaseId sub usecase ids (strings)
 * @param {string} [messageFlow="Users may opt-in by sending START to any number associated with the campaign. Users may also sign up to receive messages from this campaign via a website after accepting terms and conditions."] how subscribers are added or opt-in to the campaign
 * @param {boolean} [autoRenewal=true] subscription auto-renews?
 * @param {boolean} [subOptIn=true] provides automated opt-in?
 * @param {string} [optInKeywords="START"] opt-in keywords (comma separated)
 * @param {string} [optInMessage="You are now opted-in.\n\nFor help, reply HELP.\n\nTo opt-out, reply STOP"] automated opt-in message
 * @param {boolean} [subOptOut=true] provides automated opt-out?
 * @param {string} [optOutKeywords="STOP"] opt-out key words (comma separated)
 * @param {string} [optOutMessage="You have successfully opted-out.\n\nYou will not receive any more messages from this number.\n\nYou may reply START at any time to opt-in again."] automated opt-out message
 * @param {boolean} [subHelp=true] provides automated help?
 * @param {string} [helpKeywords="HELP"] help keywords (comma separated)
 * @param {string} [helpMessage="To opt-in and receive messages from this number, reply START.\n\nFor help, reply HELP.\n\nTo opt-out at any time, reply STOP"] automated help message
 * @param {object} [trace={}] optional CPaaS lifecycle headers
 * @return {Promsise<object>} promise resolving to a brand registration document
 */
const updateCampaign = async (
  accessToken = "null accessToken",
  accountUUID = "null accountUUID",
  campaignId = "null campaignId",
  description,
  displayName,
  sampleMsg1,
  sampleMsg2,
  sampleMsg3,
  sampleMsg4,
  sampleMsg5,
  numPooling,
  directLending,
  embeddedLink,
  embeddedPhone,
  affMarketing,
  ageGated,
  usecaseId,
  subUsecaseId,
  messageFlow = "Users may opt-in by sending START to any number associated with the campaign. Users may also sign up to receive messages from this campaign via a website after accepting terms and conditions.",
  autoRenewal = true,
  subOptIn = true,
  optInKeywords = "START",
  optInMessage = "You are now opted-in.\n\nFor help, reply HELP.\n\nTo opt-out, reply STOP",
  subOptOut = true,
  optOutKeywords = "STOP",
  optOutMessage = "You have successfully opted-out.\n\nYou will not receive any more messages from this number.\n\nYou may reply START at any time to opt-in again.",
  subHelp = true,
  helpKeywords = "HELP",
  helpMessage = "To opt-in and receive messages from this number, reply START.\n\nFor help, reply HELP.\n\nTo opt-out at any time, reply STOP",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("campaigns");
    const requestOptions = {
      method: "PUT",
      uri: `${MS}/10dlc/customers/${accountUUID}/campaigns/${campaignId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-type": "application/json",
      },
      body: {
        description: description,
        display_name: displayName,
        message_flow: messageFlow,
        sample_msg1: sampleMsg1,
        sample_msg2: sampleMsg2,
        sample_msg3: sampleMsg3,
        sample_msg4: sampleMsg4,
        sample_msg5: sampleMsg5,
        sub_opt_in: subOptIn,
        sub_opt_out: subOptOut,
        sub_help: subHelp,
        num_pooling: numPooling,
        direct_lending: directLending,
        embedded_link: embeddedLink,
        embedded_phone: embeddedPhone,
        aff_marketing: affMarketing,
        age_gated: ageGated,
        usecase_id: usecaseId,
        sub_usecase_ids: subUsecaseId,
        help_message: helpMessage,
        auto_renewal: autoRenewal,
        opt_in_keywords: optInKeywords,
        opt_out_keywords: optOutKeywords,
        help_keywords: helpKeywords,
        opt_in_message: optInMessage,
        opt_out_message: optOutMessage,
      },
      json: true,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

module.exports = {
  assignToSMSCampaign,
  createBrand,
  createCampaign,
  deleteBrand,
  deleteCampaign,
  getBrand,
  getBrandUseCases,
  getCampaign,
  getEnumerations,
  listCampaigns,
  removeFromSMSCampaign,
  updateCampaign,
};
