import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { studentTheme, teacherTheme } from '../styles/colors';

export function useTheme() {
  const { userType } = useContext(UserContext);
  
  return userType === 'teacher' ? teacherTheme : studentTheme;
}
