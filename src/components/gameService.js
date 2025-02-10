import { supabase } from "../firebase/supabaseClient";

export const fetchGames = async () => {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("is_active", true);

  if (error) throw error;
  return data;
};

export const deleteGame = async (gameId, userId) => {
  const { error } = await supabase
    .from("games")
    .delete()
    .eq("id", gameId)
    .eq("created_by", userId);

  if (error) throw error;
};

export const joinGame = async (gameId, userId) => {
  const { error } = await supabase
    .from("attendees")
    .insert([{ user_id: userId, game_id: gameId }]);

  if (error) throw error;
};