import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectLoggedInUser } from '../authSlice';

const Protected = ({ children }) => {
  const user = useSelector(selectLoggedInUser);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
