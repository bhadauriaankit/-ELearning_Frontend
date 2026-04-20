import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Clock, ChevronLeft } from 'lucide-react';

const ViewModules = () => {
  const { testId } = useParams();
  const [modules, setModules] = useState([]);
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchModules = useCallback(async () => {
    try {
      const [modulesRes, testRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/modules/test/${testId}`),
        axios.get(`http://localhost:8080/api/tests/${testId}`)
      ]);
      setModules(modulesRes.data);
      setTest(testRes.data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  }, [testId]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  // ... rest of component unchanged
};
