const { success, error, paginated } = require('../utils/response');
const { getClient } = require('../services/database');
const { v4: uuidv4 } = require('uuid');

const getEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type, departmentId, startDate, endDate } = req.query;
    const prisma = getClient();

    const where = {};
    if (type) where.type = type;
    if (departmentId) where.departmentId = departmentId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const [events, total] = await Promise.all([
      prisma.calendarEvent.findMany({
        where,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        include: {
          department: { select: { name: true, code: true } }
        },
        orderBy: { date: 'asc' }
      }),
      prisma.calendarEvent.count({ where })
    ]);

    res.json(paginated(events, page, limit, total));
  } catch (err) {
    next(err);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    const event = await prisma.calendarEvent.findUnique({
      where: { id },
      include: {
        department: true
      }
    });

    if (!event) {
      return res.status(404).json(error('Event not found', 404));
    }

    res.json(success(event));
  } catch (err) {
    next(err);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, time, location, type, departmentId, duration } = req.body;
    const prisma = getClient();

    const event = await prisma.calendarEvent.create({
      data: {
        id: uuidv4(),
        title,
        description,
        date: new Date(date),
        time: time ? new Date(`1970-01-01T${time}`) : null,
        location,
        type,
        departmentId,
        duration
      },
      include: {
        department: { select: { name: true, code: true } }
      }
    });

    res.status(201).json(success(event, 'Event created successfully'));
  } catch (err) {
    next(err);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { time, date, ...updateData } = req.body;
    const prisma = getClient();

    const data = { ...updateData };
    if (date) data.date = new Date(date);
    if (time) data.time = new Date(`1970-01-01T${time}`);

    const event = await prisma.calendarEvent.update({
      where: { id },
      data,
      include: {
        department: { select: { name: true, code: true } }
      }
    });

    res.json(success(event, 'Event updated successfully'));
  } catch (err) {
    next(err);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getClient();

    await prisma.calendarEvent.delete({
      where: { id }
    });

    res.json(success(null, 'Event deleted successfully'));
  } catch (err) {
    next(err);
  }
};

const getUpcomingEvents = async (req, res, next) => {
  try {
    const { limit = 5, departmentId } = req.query;
    const prisma = getClient();

    const where = {
      date: { gte: new Date() }
    };
    if (departmentId) where.departmentId = departmentId;

    const events = await prisma.calendarEvent.findMany({
      where,
      take: parseInt(limit),
      include: {
        department: { select: { name: true, code: true } }
      },
      orderBy: { date: 'asc' }
    });

    res.json(success(events));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getUpcomingEvents
};