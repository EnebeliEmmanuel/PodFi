// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

contract PodfiPodcast is PausableUpgradeable, ReentrancyGuardUpgradeable {
  enum PodcastStatus {
    Ongoing,
    Ended
  }

  struct Podcast {
    address creator;
    string creatorIceCandidates;
    PodcastStatus status;
    mapping(address => string) listenerIceCandidate;
    address[] listeners;
  }

  Podcast[] public podcasts;
  mapping(address => bool) public admins;

  event PodcastStarted(uint podcastId);
  event PodcastEnded(uint podcastId);
  event PodcastParticipantJoined(uint podcastId, address participant, string iceCandidates);
  event AdminAdded(address admin);
  event AdminRemoved(address admin);

  modifier onlyAdmin() {
    require(admins[msg.sender], "NOT_AN_ADMIN");
    _;
  }

  modifier onlyPodcastCreator(uint podcastId) {
    require(podcasts[podcastId].creator == msg.sender, "NOT_A_PODCAST_CREATOR");
    _;
  }

  function initialize() public initializer {
    __Pausable_init();
    __ReentrancyGuard_init();
    admins[msg.sender] = true;
  }

  function addAdmin(address admin) public onlyAdmin {
    admins[admin] = true;
    emit AdminAdded(admin);
  }

  function removeAdmin(address admin) public onlyAdmin {
    admins[admin] = false;
    emit AdminRemoved(admin);
  }

  function getPodcasts()
    public
    view
    returns (
      address[] memory creators,
      string[] memory creatorIceCandidatesList,
      PodcastStatus[] memory statuses,
      address[][] memory allListeners
    )
  {
    uint podcastCount = podcasts.length;
    creators = new address[](podcastCount);
    creatorIceCandidatesList = new string[](podcastCount);
    statuses = new PodcastStatus[](podcastCount);
    allListeners = new address[][](podcastCount);

    for (uint i = 0; i < podcastCount; i++) {
      Podcast storage podcast = podcasts[i];
      creators[i] = podcast.creator;
      creatorIceCandidatesList[i] = podcast.creatorIceCandidates;
      statuses[i] = podcast.status;
      allListeners[i] = podcast.listeners;
    }

    return (creators, creatorIceCandidatesList, statuses, allListeners);
  }

  function startPodcast(uint256 podcastId, string memory iceCandidates) external whenNotPaused nonReentrant {
    require(podcastId < podcasts.length, "Invalid podcast ID");
    Podcast storage podcast = podcasts[podcastId];
    require(podcast.creator == address(0), "Podcast ID taken!");

    podcast.creator = msg.sender;
    podcast.creatorIceCandidates = iceCandidates;
    podcast.status = PodcastStatus.Ongoing;

    emit PodcastStarted(podcastId);
  }

  function joinPodcast(uint256 podcastId, string memory iceCandidates) external whenNotPaused nonReentrant {
    require(podcastId < podcasts.length, "PODCAST_NOT_FOUND");
    require(podcasts[podcastId].status == PodcastStatus.Ongoing, "PODCAST_NOT_ONGOING");

    Podcast storage podcast = podcasts[podcastId];
    podcast.listenerIceCandidate[msg.sender] = iceCandidates;
    podcast.listeners.push(msg.sender);

    emit PodcastParticipantJoined(podcastId, msg.sender, iceCandidates);
  }

  function endPodcast(uint256 podcastId) external onlyPodcastCreator(podcastId) whenNotPaused nonReentrant {
    require(podcastId < podcasts.length, "Invalid podcast ID");
    require(podcasts[podcastId].status == PodcastStatus.Ongoing, "PODCAST_NOT_ONGOING");

    Podcast storage podcast = podcasts[podcastId];
    podcast.status = PodcastStatus.Ended;

    emit PodcastEnded(podcastId);
  }
}
