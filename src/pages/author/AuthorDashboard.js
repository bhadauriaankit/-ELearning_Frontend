import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FileText, BookOpen, Layers, CheckCircle, Lock } from 'lucide-react';  // removed PlusCircle

const AuthorDashboard = () => {
  const [hasTest, setHasTest] = useState(false);
  const [hasModules, setHasModules] = useState(false);
  const [hasQuestions, setHasQuestions] = useState(false);
  const [tests, setTests] = useState([]);

  useEffect(() => { fetchStatus(); }, []);

  const fetchStatus = async () => {
    try {
      const testsRes = await axios.get('http://localhost:8080/api/tests/my-tests');
      setTests(testsRes.data);
      setHasTest(testsRes.data.length > 0);
      if (testsRes.data.length > 0) {
        let modulesExist = false, questionsExist = false;
        for (const test of testsRes.data) {
          const modulesRes = await axios.get(`http://localhost:8080/api/modules/test/${test.id}`);
          if (modulesRes.data.length > 0) modulesExist = true;
          if (test.questions && test.questions.length > 0) questionsExist = true;
        }
        setHasModules(modulesExist);
        setHasQuestions(questionsExist);
      }
    } catch (error) { console.error('Error:', error); }
  };

  return ( /* same JSX as before – no changes needed */ );
};

export default AuthorDashboard;
