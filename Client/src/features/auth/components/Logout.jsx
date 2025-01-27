import { useEffect } from 'react';
import { selectLoggedInUser, signOutAction } from '../authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function Logout() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);

  useEffect(() => {
    dispatch(signOutAction());
  }, [dispatch]);
  if (!user) {
    return <Navigate to="/login" replace={true} />;
  }
  return <div>Logging out...</div>;
}

export default Logout;
