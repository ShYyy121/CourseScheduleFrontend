import axios from 'axios';

// 获取课程表
export async function getSchedule() {
  try {
    const response = await axios.get('/api/schedule');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// 获取特定课程表项
export async function getScheduleById(scheduleId) {
  try {
    const response = await axios.get(`/api/schedule/${scheduleId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// 添加课程表项
export async function addSchedule(scheduleData) {
  try {
    const response = await axios.post('/api/schedule', scheduleData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// 更新课程表项
export async function updateSchedule(scheduleId, updatedData) {
  try {
    const response = await axios.put(`/api/schedule/${scheduleId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// 删除课程表项
export async function deleteSchedule(scheduleId) {
  try {
    const response = await axios.delete(`/api/schedule/${scheduleId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// 根据教学班获取课程表项
export async function getScheduleByTeachingClass(teachingClassId) {
  try {
    const response = await axios.get(`/api/schedule/search/findByTeachingClass?id=${teachingClassId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// 根据实验室获取课程表项
export async function getScheduleByClassroom(classroomId) {
  try {
    const response = await axios.get(`/api/schedule/search/findByClassroom?id=${classroomId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// 根据周次、星期和课时删除课程表项
export async function deleteScheduleByWeekAndWeekdayAndPeriod(week, weekday, period) {
  try {
    const response = await axios.delete(`/api/schedule/search/deleteByWeekAndWeekdayAndPeriod?week=${week}&weekday=${weekday}&period=${period}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
