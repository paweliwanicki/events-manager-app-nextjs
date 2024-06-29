import Table from '../../components/common/Table/Table';
import classes from './FriendsPanel.module.scss';
import { useMemo, useCallback, useState, useEffect } from 'react';
import Select from 'react-select';
import Button from '../../components/common/Button/Button';
import {
  FriendshipUser,
  Friendship,
  useFriendsPanel,
} from '../../hooks/useFriendsPanel';
import SvgIcon from '../../components/common/SvgIcon/SvgIcon';
import { useUser } from '../../contexts/userContext';
import searchFriendIcon from '../../assets/icons/friend-search.svg';
import requestIcon from '../../assets/icons/request.svg';
import requestSentIcon from '../../assets/icons/request-sent.svg';
import friendsIcon from '../../assets/icons/friends.svg';

type SelectOption = {
  value: number;
  label: string;
};

const generateAvailableUsersToInviteSelectOptions = (
  data: FriendshipUser[]
): SelectOption[] => {
  return data.map(({ id, firstName, lastName }) => ({
    value: id,
    label: `${lastName} ${firstName}`,
  }));
};

const friendsTableFields = ['firstName', 'lastName'];

const FriendsPanel = () => {
  const { user } = useUser();
  const {
    friendsList,
    sentFriendRequests,
    receivedFriendsRequests,
    availableUsersToInvite,
    addFriend,
    removeFriend,
    getFriendsList,
    acceptFriendRequest,
    removeFriendRequest,
  } = useFriendsPanel();

  const [selectedNewFriend, setSelectedNewFriend] =
    useState<SelectOption | null>(null);

  const handleSelectNewFriend = useCallback((value: SelectOption | null) => {
    setSelectedNewFriend(value);
  }, []);

  const handleAcceptFriendRequestAction = useCallback(
    ({ id }: Friendship) => {
      acceptFriendRequest(id);
    },
    [acceptFriendRequest]
  );

  const handleRemoveFriendRequestAction = useCallback(
    ({ id }: Friendship) => {
      removeFriendRequest(id);
    },
    [removeFriendRequest]
  );

  const handleRemoveFriendAction = useCallback(
    ({ id }: Friendship) => {
      removeFriend(id);
    },
    [removeFriend]
  );

  const handleAddFriend = useCallback(() => {
    if (!selectedNewFriend) {
      return;
    }
    addFriend(selectedNewFriend.value);
    handleSelectNewFriend(null);
  }, [addFriend, handleSelectNewFriend, selectedNewFriend]);

  const FRIENDS_ACTIONS = useMemo(
    () => ({
      delete: handleRemoveFriendAction,
    }),
    [handleRemoveFriendAction]
  );

  const FRIENDS_REQUESTS_ACTIONS = useMemo(
    () => ({
      accept: handleAcceptFriendRequestAction,
      delete: handleRemoveFriendRequestAction,
    }),
    [handleAcceptFriendRequestAction, handleRemoveFriendRequestAction]
  );

  const SENDED_FRIENDS_ACTIONS = useMemo(
    () => ({
      delete: handleRemoveFriendRequestAction,
    }),
    [handleRemoveFriendRequestAction]
  );

  useEffect(() => {
    getFriendsList();
  }, [getFriendsList]);

  return (
    <div className={classes.friendsPanel}>
      <h2>
        <SvgIcon id="icon-map" width={96} height={96} />
        <strong>
          Hello, {user?.firstName} {user?.lastName}!
        </strong>
      </h2>
      <div className={classes.addFriendBox}>
        <h4>
          <img src={searchFriendIcon} alt="search for friends" /> Search for
          friends:
        </h4>
        <Select
          onChange={handleSelectNewFriend}
          id="friends-select"
          className="basic-single"
          classNamePrefix="select"
          isClearable={true}
          value={selectedNewFriend}
          isSearchable={true}
          name="users"
          options={generateAvailableUsersToInviteSelectOptions(
            availableUsersToInvite
          )}
          placeholder="Find user..."
        />

        <Button
          variant="primary"
          onClick={handleAddFriend}
          disabled={!selectedNewFriend}
        >
          Add Friend
        </Button>
      </div>
      <div className={classes.friendsList}>
        <h3>
          <img src={friendsIcon} alt="your friends" /> Your friends
        </h3>
        <Table
          data={friendsList}
          fields={friendsTableFields}
          actions={FRIENDS_ACTIONS}
          noDataPlaceholderText="You have no friends ;<"
        />
      </div>
      <div className={classes.friendsRequestsList}>
        <h3>
          <img src={requestSentIcon} alt="sended requests" /> Invitations sent
        </h3>
        <Table
          data={sentFriendRequests}
          fields={friendsTableFields}
          actions={SENDED_FRIENDS_ACTIONS}
          noDataPlaceholderText="No friend requests sent"
        />
      </div>
      <div className={classes.friendsRequestsList}>
        <h3>
          <img src={requestIcon} alt="requests received" /> Invitations received
        </h3>
        <Table
          data={receivedFriendsRequests}
          fields={friendsTableFields}
          actions={FRIENDS_REQUESTS_ACTIONS}
          noDataPlaceholderText="No friends requsts received."
        />
      </div>
    </div>
  );
};

export default FriendsPanel;
