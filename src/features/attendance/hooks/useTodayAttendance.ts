import { useQuery } from "@tanstack/react-query";
import { fetchTodayAttendance } from "../api";

export function useTodayAttendance() {
  return useQuery({
    queryKey: ["attendance", "today"],
    queryFn: fetchTodayAttendance,
  });
}
