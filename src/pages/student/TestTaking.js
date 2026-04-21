import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Clock, Lock } from 'lucide-react';
import { API_URL } from '../../config';

const TestTaking = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [modulesInfo, setModulesInfo] = useState({ total: 0, completed: 0 });

  const getUserId = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr).id;
    } catch {
      return null;
    }
  };

  const checkAccessAndStart = async () => {
    try {
      setCheckingAccess(true);
      const [testRes, modulesRes] = await Promise.all([
        axios.get(`${API_URL}/api/tests/${testId}`),
        axios.get(`${API_URL}/api/modules/test/${testId}`)
      ]);
      setTest(testRes.data);
      const modules = modulesRes.data;
      const userId = getUserId();
      const storageKey = `course_${testId}_progress_${userId}`;
      const saved = localStorage.getItem(storageKey);
      const completedIds = saved ? JSON.parse(saved) : [];
      const completedCount = modules.filter(m => completedIds.includes(m.id)).length;
      setModulesInfo({ total: modules.length, completed: completedCount });
      if (modules.length > 0 && completedCount !== modules.length) {
        setAccessDenied(true);
        toast.error(`Complete all ${modules.length} modules before taking the test.`);
        setCheckingAccess(false);
        return;
      }
      await startTest();
    } catch (err) {
      console.error(err);
      toast.error('Failed to load test');
      setCheckingAccess(false);
    }
  };

  const startTest = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/attempts/start?testId=${testId}`);
      setAttempt(response.data);
      setTimeLeft(response.data.duration * 60);
      const initial = {};
      response.data.questions?.forEach(q => { initial[q.id] = null; });
      setAnswers(initial);
      setCheckingAccess(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to start test');
      navigate('/dashboard');
    }
  };

  const saveAnswer = async (qid, opt) => {
    try {
      await axios.post(`${API_URL}/api/attempts/${attempt.attemptId}/answer?questionId=${qid}&option=${opt}`);
    } catch (err) { console.error(err); }
  };

  const handleAnswer = (qid, opt) => {
    setAnswers(prev => ({ ...prev, [qid]: opt }));
    saveAnswer(qid, opt);
  };

  const handleSubmit = async () => {
    if (!window.confirm('Submit your test? You cannot change answers after submission.')) return;
    setSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/api/attempts/${attempt.attemptId}/submit`);
      const { percentage } = response.data; // removed unused 'score'
      const passed = percentage >= 60;
      toast.success(passed ? 'Test passed! Result emailed.' : 'Test submitted. Result emailed.');
      navigate(`/result/${response.data.attemptId}`);
    } catch (err) {
      toast.error('Failed to submit test');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    checkAccessAndStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId]);

  if (checkingAccess) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" /></div>;

  if (accessDenied) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Lock className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Test Locked</h1>
            <p>You need to complete all {modulesInfo.total} modules before taking the test.</p>
            <p className="mt-2 text-gray-600">Completed: {modulesInfo.completed}/{modulesInfo.total}</p>
            <button onClick={() => navigate(`/course/${testId}`)} className="mt-6 btn-primary">Continue Learning</button>
          </div>
        </div>
      </div>
    );
  }

  if (!test || !attempt) return <div className="flex justify-center items-center h-64"><div className="animate-spin" /></div>;

  const answeredCount = Object.values(answers).filter(a => a !== null).length;
  const totalQuestions = test.questions?.length || 0;
  const progress = totalQuestions ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-6">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 sticky top-0 z-10">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div><h1 className="text-2xl font-bold">{test.title}</h1><p className="text-gray-600">Question {answeredCount} of {totalQuestions}</p></div>
            <div className="text-right">
              <div className="flex items-center text-2xl font-bold text-indigo-600"><Clock className="h-6 w-6 mr-2" />{formatTime(timeLeft)}</div>
              <button onClick={handleSubmit} disabled={submitting} className="mt-2 px-6 py-2 bg-indigo-600 text-white rounded-lg">Submit</button>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm"><span>Progress</span><span>{Math.round(progress)}%</span></div>
            <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${progress}%` }} /></div>
          </div>
        </div>

        <div className="space-y-6">
          {test.questions?.map((q, idx) => (
            <div key={q.id} className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4"><span className="text-indigo-600 mr-2">Q{idx+1}.</span>{q.questionText}</h3>
              <div className="space-y-3">
                {['A','B','C','D'].map(opt => (
                  <label key={opt} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${answers[q.id] === opt ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}>
                    <input type="radio" name={`q-${q.id}`} value={opt} checked={answers[q.id] === opt} onChange={() => handleAnswer(q.id, opt)} className="h-4 w-4 text-indigo-600" />
                    <span className="ml-3"><span className="font-semibold mr-2">{opt}.</span>{q[`option${opt}`]}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={handleSubmit} disabled={submitting || answeredCount !== totalQuestions} className="px-12 py-3 bg-indigo-600 text-white rounded-lg font-semibold disabled:opacity-50">
            {submitting ? 'Submitting...' : (answeredCount !== totalQuestions ? `Answer all (${answeredCount}/${totalQuestions})` : 'Submit Test')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestTaking;