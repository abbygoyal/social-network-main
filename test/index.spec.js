/* eslint-disable no-undef */
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  deleteDoc,
} from '../src/lib/exports.js';
import {
  loginWithUser,
  loginWithGoogle,
  createNewUser,
  logout,
} from '../src/lib/firebase-auth.js';
import {
  createPost,
  getPost,
  editPost,
  getPostById,
  deletePost,
  likePost,
} from '../src/lib/firestore.js';

jest.mock('../src/lib/exports.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('loginWithUser', () => {
  it(' the role must login a user using email and password', () => {
    signInWithEmailAndPassword.mockResolvedValue({
      email: {},
      password: {},
    });
    loginWithUser('amandinha@gmail.com', '123456');
    expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
  });
});

describe('createNewUser', () => {
  it('the role must create a user account using your email and password', () => {
    createUserWithEmailAndPassword.mockResolvedValueOnce({
      email: {},
      password: {},
    });
    createNewUser('lizandramiazaki@gmail.com', '@LFmiazaki');
    expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
  });
});

describe('loginWithGoogle', () => {
  it('the function must log in a user using their google account', () => {
    signInWithPopup.mockResolvedValue();
    loginWithGoogle();
    expect(signInWithPopup).toHaveBeenCalledTimes(1);
  });
});

describe('logout', () => {
  it(' the function must log out the user', () => {
    signOut.mockResolvedValue({
      user: {},
    });
    logout();
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});

describe('createPost', () => {
  it(' the function must create a post', async () => {
    const mockGetAuth = {
      currentUser: {
        displayName: 'nome',
        uid: '123',
      },
    };

    getAuth.mockReturnValueOnce(mockGetAuth);
    addDoc.mockResolvedValue();

    const contentPost = 'texto do meu post';
    await createPost(contentPost);

    expect(addDoc).toHaveBeenCalledTimes(1);
    expect(addDoc).toHaveBeenCalledWith(undefined, {
      name: mockGetAuth.currentUser.displayName,
      author: mockGetAuth.currentUser.uid,
      text: contentPost,
      like: [],
    });
  });
});

describe('getPost', () => {
  it('the function must return an array with the post to be printed on the screen', () => {
    getDocs.mockResolvedValue([
      {
        author: {},
        id: {},
        like: [],
        name: {},
        text: {},
      },
    ]);
    getPost(
      'x4H2994HPjV9zm6cp7am58XTjci2',
      '0pRNd4MNFXm3QAI2TYeL',
      ['J5rtQSlAJqO13E7znQknbvC236U2', 'scbc2YPdX5gnlsKodSzDLh3mpPr2'],
      'Amanda',
      'Socorro Deus!'
    );
    expect(getDocs).toHaveBeenCalledTimes(1);
  });
});

describe('editPost', () => {
  it('the function must update a post', async () => {
    const userId = 'id do usuário';
    const postToBeEdited = 'texto a ser editado';

    updateDoc.mockResolvedValue();

    await editPost(userId, postToBeEdited);

    expect(updateDoc).toHaveBeenCalledTimes(1);
    expect(updateDoc).toHaveBeenCalledWith(undefined, {
      text: postToBeEdited,
    });
  });
});

// não passou
describe('deletePost', () => {
  it('the function must delete a post from the userid', async () => {
    const mockRef = {};
    const mockPostCollection = {
      posts: {
        userId: 'shdiasudhiasudhasj',
      },
    };

    doc.mockReturnValueOnce(mockRef);
    deleteDoc.mockResolvedValueOnce(mockRef);

    await deletePost(mockPostCollection.posts.userId);

    expect(doc).toHaveBeenCalledTimes(1);
    expect(doc).toHaveBeenCalledWith(
      undefined,
      'post',
      mockPostCollection.posts.userId
    );
    expect(deleteDoc).toHaveBeenCalledTimes(1);
    expect(deleteDoc).toHaveBeenCalledWith(mockRef);
  });
});

// PASSOOOOU UHUUU!!!
describe('getPostById', () => {
  it('the function must get the id of a post', async () => {
    const id = 'abc123';
    const ref = {};
    const post = {
      data: jest.fn(),
    };
    doc.mockReturnValueOnce(ref);
    getDoc.mockResolvedValueOnce(post);
    await getPostById(id);
    expect(doc).toHaveBeenCalledTimes(1);
    expect(doc).toHaveBeenCalledWith(undefined, 'post', id);
    expect(getDoc).toHaveBeenCalledTimes(1);
    expect(getDoc).toHaveBeenCalledWith(ref);
    expect(post.data).toHaveBeenCalledTimes(1);
  });
});

describe('likePost', () => {
  it('the function must add like to the post', async () => {
    const mockPost = {
      data() {
        const likes = {
          like: [],
        };
        return likes;
      },
    };

    const postId = 'post id';
    const userId = 'User ID';

    getDoc.mockResolvedValue(mockPost);

    await likePost(postId, userId);
    expect(updateDoc).toHaveBeenCalledTimes(1);
    expect(updateDoc).toHaveBeenCalledWith(undefined, {
      like: [userId],
    });
  });

  it('the function must remove the like from the post', async () => {
    const postId = 'post id';
    const userId = 'User ID';

    const mockPost = {
      data() {
        const likes = {
          like: [userId],
        };
        return likes;
      },
    };

    getDoc.mockResolvedValue(mockPost);

    await likePost(postId, userId);
    expect(updateDoc).toHaveBeenCalledTimes(1);
    expect(updateDoc).toHaveBeenCalledWith(undefined, {
      like: [],
    });
  });
});
