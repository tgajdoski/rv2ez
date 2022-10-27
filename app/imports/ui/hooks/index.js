import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

// reusable hook for Account
export const useAccount = () => useTracker(() => {
  const user = Meteor.user();
  const userId = Meteor.userId();
  return {
    user,
    userId,
    isLoggedIn: !!userId,
  };
}, []);
