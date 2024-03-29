import { db } from "../utils/db";
import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import supabase from "../utils/supabase";

const userController = {} as UserController;

interface UserController {
  signup: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  signin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  signout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getSession: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  getUserInfo: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  searchUsers: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  checkIsFollowing: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  toggleFollow: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  editProfile: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}

userController.signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, username } = req.body;
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
          profile_avatar: "PROFILE",
        },
      },
    });
    res.locals.data = data;
    console.log(error);
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

userController.signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    res.locals.loggedinUser = data;
    next();
  } catch (error) {
    next(error);
  }
};

userController.getSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data, error } = await supabase.auth.getSession();
    res.locals.data = data;
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

userController.getUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("profile_avatar, description")
      .eq("id", req.query.id);
    res.locals.userInfo = data;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

userController.signout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = await supabase.auth.signOut();
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

userController.searchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (typeof req.query.name === "string") {
      const name = req.query.name;
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, profile_avatar")
        .textSearch("username", name);
      res.locals.searchResults = data;
    }
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

userController.checkIsFollowing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data, error } = await supabase
      .from("relationships")
      .select("id")
      .match({
        follower_id: req.query.follower,
        followed_id: req.query.followed,
      });
    if (data) {
      if (data.length > 0) res.locals.isFollowing = true;
      else res.locals.isFollowing = false;
    }
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

userController.toggleFollow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.query.following === "true") {
      const { error } = await supabase.from("relationships").insert({
        follower_id: req.query.follower,
        followed_id: req.query.followed,
      });
      res.locals.follow = "followed";
    } else {
      const { error } = await supabase.from("relationships").delete().match({
        follower_id: req.query.follower,
        followed_id: req.query.followed,
      });
      res.locals.follow = "unfollowed";
    }
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

userController.editProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("in edit profile: ", req.body);
    const { data } = await supabase.auth.getSession();
    // console.log(data);
    // console.log(data.session.user_metadata)
    await supabase.auth.updateUser({ data: { username: req.body.username } });
    const { error } = await supabase
      .from("profiles")
      .update({
        username: req.body.username,
        description: req.body.description,
      })
      .eq("id", req.body.id);
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default userController;
