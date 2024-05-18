// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/**
 * @title Podfi Decentralized Marketplace Smart Contract
 * @dev This contract manages the interactions between advertisers and podcast creators in a decentralized marketplace.
 * It allows advertisers to create and manage ads, and podcast creators to approve or reject ads.
 */
contract PodfiAdsMarketplace is Initializable, PausableUpgradeable, ReentrancyGuardUpgradeable, OwnableUpgradeable {
  uint public nextAdvertiserId;
  uint public nextPodcastCreatorId;
  uint public nextAdId;

  enum AdStatus {
    Inactive,
    Active
  }

  struct Advertiser {
    uint id;
    address account;
    string name;
    bool isVerified;
  }

  struct PodcastCreator {
    uint id;
    uint averageEngagement;
    address account;
    string channelName;
    string name;
    bool isVerified;
  }

  struct Ad {
    uint id;
    address advertiser;
    string content;
    string tag;
    uint minimumeTargetEngagement;
    uint cost;
    AdStatus status;
    uint numberOfDays;
    uint runnerFunds;
    uint numberOfChannels;
  }

  struct SubsribedAd {
    uint id;
    uint expirationDate;
  }

  mapping(address => Advertiser) public advertisers;
  mapping(address => PodcastCreator) public podcastCreators;
  mapping(address => uint) public pcWalletBalance;
  mapping(address => mapping(uint => SubsribedAd)) public subsribedAds;
  mapping(uint => Ad) public adverts;
  mapping(address => bool) public admins;

  event AdCreated(uint adId, address advertiser, string tag);
  event AdStatusChanged(uint adId, AdStatus status);
  event AdSubscribed(uint adId);
  event RunnerFund(uint adId, uint amount);
  event RegisterationSuccess(address _registrant, uint id);

  error FundsForAdsUnavailable();

  modifier onlyAdmin() {
    require(admins[msg.sender], "NOT_AN_ADMIN");
    _;
  }

  modifier onlyAdvertiser() {
    require(advertisers[msg.sender].account == msg.sender, "NOT_AN_ADVERTISER");
    _;
  }

  modifier onlyPodcastCreator() {
    require(podcastCreators[msg.sender].account == msg.sender, "NOT_A_PODCAST_CREATOR");
    _;
  }

  modifier onlyVerifiedAdvertiser() {
    require(advertisers[msg.sender].isVerified, "ADVERTISER_IS_NOT_VERIFIED");
    _;
  }

  modifier onlyVerifiedPodcastCreator() {
    require(podcastCreators[msg.sender].isVerified, "PODCASTOR_IS_NOT_VERIFIED");
    _;
  }

  function initialize() public initializer {
    __Pausable_init();
    __ReentrancyGuard_init();
    __Ownable_init();
    admins[msg.sender] = true;
  }

  function getAds() external view returns (Ad[] memory) {
    uint adSize = nextAdId;
    Ad[] memory ads = new Ad[](adSize);
    for (uint i = 0; i < adSize; i++) {
      ads[i] = adverts[i];
    }
    return ads;
  }

  function getAdvertiser(address avertiser) external view returns (Advertiser memory) {
    return advertisers[avertiser];
  }

  function getPodcaster(address podcaster) external view returns (PodcastCreator memory, SubsribedAd[] memory) {
    uint adSize = nextAdId;
    SubsribedAd[] memory _subscribedAds = new SubsribedAd[](adSize);

    for (uint i = 0; i < adSize; i++) {
      if (subsribedAds[podcaster][i].expirationDate != 0) {
        _subscribedAds[i] = subsribedAds[podcaster][i];
      }
    }
    return (podcastCreators[podcaster], _subscribedAds);
  }

  function registerAdvertiser(string memory name) external {
    require(advertisers[msg.sender].account != msg.sender, "ALREADY_REGISTERED_ADVERTISER");
    Advertiser storage newAdvertiser = advertisers[msg.sender];
    newAdvertiser.id = nextAdvertiserId;
    newAdvertiser.account = msg.sender;
    newAdvertiser.name = name;
    newAdvertiser.isVerified = false;
    emit RegisterationSuccess(msg.sender, nextAdvertiserId);
    nextAdvertiserId++;
  }

  function createAd(
    string memory content,
    string memory tag,
    uint cost,
    uint numberOfDays,
    uint targetEngagement,
    uint numberOfChannels
  ) external payable onlyAdvertiser onlyVerifiedAdvertiser whenNotPaused {
    uint runnerFunds = cost * numberOfChannels;
    require(msg.value >= runnerFunds, "INSUFFICIENT_FUNDS_TO_RUN_ADS");

    Ad memory newAd = Ad({
      id: nextAdId,
      advertiser: msg.sender,
      content: content,
      tag: tag,
      minimumeTargetEngagement: targetEngagement,
      cost: cost,
      status: AdStatus.Active,
      numberOfDays: numberOfDays,
      numberOfChannels: numberOfChannels,
      runnerFunds: runnerFunds
    });

    adverts[nextAdId] = newAd;

    emit AdCreated(nextAdId, msg.sender, tag);
    nextAdId++;
  }

  function incrementRunnerFunds(
    uint adId,
    uint amount
  ) external onlyAdvertiser onlyVerifiedAdvertiser whenNotPaused nonReentrant {
    Ad storage ad = adverts[adId];
    require(msg.sender == ad.advertiser && amount > 0, "UNAUTHORIZED_NOT_CREATOR_OF_AD");
    ad.runnerFunds += amount;
    emit RunnerFund(adId, amount);
  }

  function withdrawAdsFunds(uint adId) external onlyAdvertiser onlyVerifiedAdvertiser whenNotPaused nonReentrant {
    Ad storage ad = adverts[adId];
    require(ad.advertiser == msg.sender, "UNAUTHORIZED_WITHDRAWER");
    uint amount = ad.runnerFunds;
    ad.runnerFunds = 0;
    payable(msg.sender).transfer(amount);
  }

  function registerPodcastCreator(
    string memory name,
    string memory channelName,
    uint averageEngagement
  ) external whenNotPaused {
    require(podcastCreators[msg.sender].account != msg.sender, "ALREADY_REGISTERED_PODCAST_CREATORS");

    PodcastCreator storage newPodcaster = podcastCreators[msg.sender];
    newPodcaster.id = nextPodcastCreatorId;
    newPodcaster.account = msg.sender;
    newPodcaster.channelName = channelName;
    newPodcaster.name = name;
    newPodcaster.averageEngagement = averageEngagement;
    emit RegisterationSuccess(msg.sender, nextPodcastCreatorId);
    nextPodcastCreatorId++;
  }

  function withdrawPodFunds() external onlyPodcastCreator onlyVerifiedPodcastCreator whenNotPaused nonReentrant {
    uint amount = pcWalletBalance[msg.sender];
    pcWalletBalance[msg.sender] = 0;
    payable(msg.sender).transfer(amount);
  }

  function subscribeToAd(uint adId) external onlyPodcastCreator onlyVerifiedPodcastCreator whenNotPaused nonReentrant {
    Ad storage ad = adverts[adId];
    PodcastCreator storage pc = podcastCreators[msg.sender];
    SubsribedAd storage sAd = subsribedAds[msg.sender][adId];
    require(sAd.expirationDate < block.timestamp, "ADVERTS_IS_CURRENT_RUNNING");
    require(ad.minimumeTargetEngagement >= pc.averageEngagement, "MINIMUM_ENGAGEMENT_FOR_RUNNING_AD_NOT_MET");
    if (ad.runnerFunds < ad.cost) {
      revert FundsForAdsUnavailable();
    }
    ad.runnerFunds -= ad.cost;
    pcWalletBalance[msg.sender] += ad.cost;
    sAd.expirationDate = block.timestamp + (ad.numberOfDays * 1 days);
    sAd.id = ad.id;
    emit AdSubscribed(adId);
  }

  function verifyPodcastCreator(address podcastCreator) external onlyAdmin {
    podcastCreators[podcastCreator].isVerified = true;
  }

  function verifyAdvertiser(address advertiser) external onlyAdmin {
    advertisers[advertiser].isVerified = true;
  }

  function unpausePMP() external whenPaused onlyAdmin {
    _unpause();
  }

  function pausePMP() external whenNotPaused onlyAdmin {
    _pause();
  }
}
