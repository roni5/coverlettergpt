import { GetCoverLetter, GetJobs, GetJob, GetUserInfo, GetCoverLetterCount } from '@wasp/queries/types';
import { CoverLetter, Job, User } from '@wasp/entities';
import HttpError from '@wasp/core/HttpError.js';

export const getCoverLetter: GetCoverLetter<CoverLetter> = async ({ id }, context) => {
  if (!context.user) {
    return context.entities.CoverLetter.findFirst({
      where: {
        id,
      },
    });
  }

  return context.entities.CoverLetter.findFirst({
    where: {
      id,
      user: { id: context.user.id },
    },
  });
};

type GetCoverLetterArgs = {
  id: string;
};

export const getCoverLetters: GetCoverLetter<GetCoverLetterArgs, CoverLetter[]> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.CoverLetter.findMany({
    where: {
      job: { id },
      user: { id: context.user.id },
    },
  });
};

export const getJobs: GetJobs<Job[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Job.findMany({
    where: {
      user: { id: context.user.id },
    },
    include: {
      coverLetter: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getJob: GetJob<Job> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Job.findFirst({
    where: {
      id,
      user: { id: context.user.id },
    },
    include: {
      coverLetter: true,
    },
  });
};

export const getUserInfo: GetUserInfo<Pick<User, 'id' | 'email' | 'hasPaid' | 'notifyPaymentExpires' | 'credits'> & { letters: CoverLetter[] }> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.User.findFirst({
    where: {
      id: context.user.id,
    },
    select: {
      letters: true,
      id: true,
      email: true,
      hasPaid: true,
      notifyPaymentExpires: true,
      credits: true,
    },
  });
};

export const getCoverLetterCount: GetCoverLetterCount<number> = async (_args, context) => {
  return context.entities.CoverLetter.count();
}