macro id {
  case {id $x } => {
    return #{
      $x
    }
  }
}

export id;
