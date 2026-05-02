import { useRouter } from 'expo-router';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import type { Member, Residence } from '@balancehogar/types';
import {
  ApiClientError,
  type BalanceHogarApi,
} from '@balancehogar/api-client';
import { getApi, setOnUnauthorized } from '../lib/api/client';

type Status = 'loading' | 'authenticated' | 'unauthenticated';

type State = {
  status: Status;
  token: string | null;
  member: Member | null;
  residence: Residence | null;
  members: Member[];
};

type Action =
  | { type: 'BOOT_DONE'; payload: { token: string | null } }
  | {
      type: 'SET_AUTH';
      payload: { token: string; member: Member; residence: Residence };
    }
  | { type: 'CLEAR' }
  | { type: 'SET_RESIDENCE'; payload: Residence }
  | { type: 'SET_MEMBER'; payload: Member }
  | { type: 'SET_MEMBERS'; payload: Member[] };

const initialState: State = {
  status: 'loading',
  token: null,
  member: null,
  residence: null,
  members: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'BOOT_DONE':
      return {
        ...state,
        token: action.payload.token,
        status: action.payload.token ? state.status : 'unauthenticated',
      };
    case 'SET_AUTH':
      return {
        ...state,
        status: 'authenticated',
        token: action.payload.token,
        member: action.payload.member,
        residence: action.payload.residence,
      };
    case 'SET_RESIDENCE':
      return { ...state, residence: action.payload };
    case 'SET_MEMBER':
      return { ...state, member: action.payload };
    case 'SET_MEMBERS':
      return { ...state, members: action.payload };
    case 'CLEAR':
      return { ...initialState, status: 'unauthenticated' };
    default:
      return state;
  }
}

type Ctx = {
  api: BalanceHogarApi;
  state: State;
  bootstrap: () => Promise<void>;
  setAuth: (payload: { token: string; member: Member; residence: Residence }) => void;
  refreshMembers: () => Promise<Member[]>;
  refreshResidence: () => Promise<Residence>;
  logout: () => Promise<void>;
};

const SessionContext = createContext<Ctx | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const api = useMemo(() => getApi(), []);
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    setOnUnauthorized(() => {
      dispatch({ type: 'CLEAR' });
      router.replace('/onboarding');
    });
  }, [router]);

  const bootstrap = useCallback(async () => {
    try {
      const token = await api.client.storage.getToken();
      if (!token) {
        dispatch({ type: 'BOOT_DONE', payload: { token: null } });
        return;
      }
      dispatch({ type: 'BOOT_DONE', payload: { token } });
      const [member, residence, members] = await Promise.all([
        api.auth.me(),
        api.residences.getMine(),
        api.members.list(),
      ]);
      dispatch({ type: 'SET_AUTH', payload: { token, member, residence } });
      dispatch({ type: 'SET_MEMBERS', payload: members });
    } catch (error) {
      if (error instanceof ApiClientError && error.code === 'UNAUTHORIZED') {
        await api.client.storage.clearToken();
      }
      dispatch({ type: 'CLEAR' });
    }
  }, [api]);

  const setAuth = useCallback(
    (payload: { token: string; member: Member; residence: Residence }) => {
      dispatch({ type: 'SET_AUTH', payload });
      api.members
        .list()
        .then((members) => dispatch({ type: 'SET_MEMBERS', payload: members }))
        .catch(() => {
          /* noop */
        });
    },
    [api],
  );

  const refreshMembers = useCallback(async () => {
    const members = await api.members.list();
    dispatch({ type: 'SET_MEMBERS', payload: members });
    return members;
  }, [api]);

  const refreshResidence = useCallback(async () => {
    const residence = await api.residences.getMine();
    dispatch({ type: 'SET_RESIDENCE', payload: residence });
    return residence;
  }, [api]);

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } finally {
      dispatch({ type: 'CLEAR' });
      router.replace('/onboarding');
    }
  }, [api, router]);

  const value = useMemo<Ctx>(
    () => ({ api, state, bootstrap, setAuth, refreshMembers, refreshResidence, logout }),
    [api, state, bootstrap, setAuth, refreshMembers, refreshResidence, logout],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): Ctx {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession debe usarse dentro de <SessionProvider>');
  }
  return ctx;
}
