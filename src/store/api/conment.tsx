import axios from 'axios';

const API_URL = 'http://localhost:3000/reviews';

export const fetchReviewsByProduct = async (phoneId: number) => {
  const response = await axios.get(`${API_URL}?phoneId=${phoneId}`);
  return response.data;
};

export const postReview = async (review: {
  phoneId: number;
  userId: number;
  rating: number;
  comment: string;
}) => {
  const response = await axios.post(API_URL, review);
  return response.data;
};
