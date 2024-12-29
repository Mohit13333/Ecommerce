import { useEffect } from 'react';
import { selectLoggedInUser, signOutAction } from '../authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function Logout() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);

  useEffect(() => {
    // Trigger sign-out action when the component is mounted
    dispatch(signOutAction());
  }, [dispatch]);

  // Show a redirect only when the user is logged out
  if (!user) {
    return <Navigate to="/login" replace={true} />;
  }

  // Optionally, render a loading message while the logout process is ongoing
  return <div>Logging out...</div>;
}

export default Logout;
